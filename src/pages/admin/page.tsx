import React, { useState, useEffect, Key } from 'react';
import { Table, Input, Button, Space, Form, message, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { TipoUsuario, User } from '../../models/user.model';
import { ColumnsType } from 'antd/es/table';
import { ColumnType, FilterDropdownProps, FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import userServices from '../../services/userServices';
import { FilterWithoutSearch } from '../../interfaces/pagination.interface';
import { handleError } from '../../utils/handleError';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';



const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [filter, setFilter] = useState<FilterWithoutSearch>({
        sort: 'id',
        order: 'asc',
        filter: {},
    });
    const [searchText, setSearchText] = useState('');
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        if (!user || user.tipo_usuario !== TipoUsuario.ADMIN) {
            navigate('/home');
        }
    }, [user]);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.limit, searchText ,filter.sort, filter.order, filter.filter])

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userServices.getUsersOnlyAdmin({
                page: pagination.page,
                limit: pagination.limit,
                filter: {
                    sort: filter.sort ?? 'id',
                    order: filter.order ?? 'asc',
                    search: searchText ?? '',
                    filter: filter.filter ?? {},
                },
            });
            setUsers(response.data?.users || []);
            setPagination({
                ...pagination,
                total: response.data?.totalUsers || 0,
            });
        } catch (error:unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<User> | SorterResult<User>[]) => {
        console.log(filters);
        setPagination(prev => ({
            ...prev,
            page: pagination.current || 1,
            limit: pagination.pageSize || 10,
        }));

        if (Array.isArray(sorter) && sorter.length > 0) {
            setFilter({
                sort: sorter[0].columnKey as string,
                order: sorter[0].order ==='ascend' ? 'asc' : 'desc',
                filter: {}
            });
        } else if (!Array.isArray(sorter) && sorter.order) {
            setFilter({
                sort: sorter.field as string,
                order: sorter.order === 'ascend' ? 'asc' : 'desc',
                filter: {},
            });
        }else{
            setFilter({
                sort: 'id',
                order: 'asc',
                filter: {},
            });
        }
    };

    const handleSearch = (selectedKeys: Key[], confirm: () => void) => {
        confirm();
        setSearchText(selectedKeys[0] as string);
        setPagination(prev => ({ ...prev, current: 1 })); 
    };

    const handleReset = (clearFilters: (() => void) | undefined, confirm: () => void) => {
        if (clearFilters) {
            clearFilters();
        }
        setSearchText('');
        setPagination(prev => ({ ...prev, current: 1 })); 
        confirm(); 
    };

    const isEditing = (record: User) => record.id === editingKey;

    const edit = (record: User) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey(null);
    };

    const save = async (id: number) => {
        try {
            const row = await form.validateFields();
            const newData = [...users];
            const index = newData.findIndex(item => id === item.id);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setUsers(newData);
                setEditingKey(null);
                const response = await userServices.updateUser(id, row);
                message.success(response.message);
                fetchUsers();
            } else {
                newData.push(row);
                setUsers(newData);
                setEditingKey(null);
            }
        } catch (error:unknown) {
            handleError(error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await userServices.deleteUser(id);
            message.success(response.message);
            fetchUsers();
        } catch (error:unknown) {
            handleError(error);
        }
    };

    const columns: (ColumnsType<User>[number] & { editable?: boolean })[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            editable: false,
            defaultSortOrder: 'ascend',
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            sorter: true,
            editable: true,
            // sorter: (a, b) => (a.usuario || '').localeCompare(b.usuario || ''),
            sortDirections: ['ascend', 'descend'],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar usuario"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Buscar
                        </Button>
                        <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                            Limpiar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            sorter: true,
            editable: true,
            dataIndex: 'tipo_usuario',
            title: 'Tipo de usuario',
            // sorter: (a, b) => (a.tipo_usuario || '').localeCompare(b.tipo_usuario || ''),
            sortDirections: ['ascend', 'descend'],
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar tipo de usuario"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Buscar
                        </Button>
                        <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                            Limpiar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Acciones',
            render: (_, record: User) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space size="middle">
                        <Button icon={<SaveOutlined />} onClick={() => save(record.id)} />
                        <Button icon={<CloseOutlined />} onClick={cancel} />
                    </Space>
                ) : (
                    <Space size="middle">
                        <Button icon={<EditOutlined />} onClick={() => edit(record)} />
                        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: User) => {
              
                return ({
                    record,
                    inputType: (col as ColumnType<User>).dataIndex === 'id' ? 'number' : 'text',
                    dataIndex: (col as ColumnType<User>).dataIndex,
                    title: col.title as string,
                    editing: isEditing(record),
                })
            
            }
        };
    });


    return (
        <div className='container p-4 mx-auto'>
            <h1 className='mb-4 text-2xl font-bold text-center'>Mantenimiento de usuarios (ADMIN)</h1>
            <div className='p-4 bg-white rounded shadow-md'>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns}
                        rowKey="id"
                        dataSource={users}
                        pagination={false}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </Form>
                <Pagination
                    className='mt-4'
                    current={pagination.page}
                    total={pagination.total}
                    showTotal={total => `Total ${total} items`}
                    pageSize={pagination.limit}
                    onChange={(page, size) => setPagination({ ...pagination, page: page, limit: size })}
                    defaultPageSize={10}
                    defaultCurrent={1}
                    pageSizeOptions={['10', '20', '30', '40', '50']}
                />
            </div>
        </div>
    );
};

interface EditableCellProps {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'text' | 'number';
    record: User;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    // record,
    // index,
    children,
    ...restProps
}) => {
    
    const inputNode = inputType === 'number' ? <Input type="number" /> : <Input  />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Por favor ingrese ${title}!` },
                        dataIndex === 'tipo_usuario'? {
                            type: 'enum',
                            enum: [TipoUsuario.ADMIN, TipoUsuario.USER],
                            message: 'Tipo de usuario solo puede ser ADMIN o USER',
                        } : {}
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default AdminPage;
