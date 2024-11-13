import React, { useState, useEffect, Key } from 'react';
import { Table, Input, Button, Space, Modal, Form, message, Pagination } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { TipoUsuario, User } from '../../models/user.model';
import userService from '../../services/userServices';
import { ColumnsType } from 'antd/es/table';
import { FilterDropdownProps, FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import {  FilterWithoutSearch } from '../../interfaces/pagination.interface';
import { handleError } from '../../utils/handleError';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const Home: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const [filter, setFilter] = useState<FilterWithoutSearch>({
        sort: 'id',
        order: 'asc',
        filter: {},
    });
    const [searchText, setSearchText] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.limit, searchText ,filter.sort, filter.order, filter.filter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
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
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<User> | SorterResult<User>[]) => {
        setPagination(prev => ({
            ...prev,
            page: pagination.current || 1,
            limit: pagination.pageSize || 10,
        }));

        if (Array.isArray(sorter) && sorter.length > 0) {
            setFilter({
                sort: sorter[0].columnKey as string,
                order: sorter[0].order ==='ascend' ? 'asc' : 'desc',
                filter: Object.keys(filters).reduce((acc: Record<string, string>, key) => {
                    if (filters[key]) {
                        acc[key] = filters[key]?.[0] as string;
                    }
                    return acc;
                }
                    , {}),
            });
        } else if (!Array.isArray(sorter) && sorter.order) {
            setFilter({
                sort: sorter.field as string,
                order: sorter.order === 'ascend' ? 'asc' : 'desc',
                filter: Object.keys(filters).reduce((acc: Record<string, string>, key) => {
                    if (filters[key]) {
                        acc[key] = filters[key]?.[0] as string;
                    }
                    return acc;
                }
                    , {}),
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
        setPagination({ ...pagination, page: 1 });
    };

    const handleReset = (clearFilters: (() => void) | undefined , confirm: () => void) => {
        if (clearFilters) {
            clearFilters();
        }
        setSearchText('');
        confirm();
    };

    const handleEdit = (record: User) => {
        setEditingUser(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await userService.deleteUser(id);
            message.success(response.message);
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await userService.updateUser(editingUser?.id as number, values);
            message.success(response.message);
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleCheckAdmin = () => {
        
        if(user?.tipo_usuario === TipoUsuario.ADMIN){
            navigate('/admin');
        }else{
            message.error('No tienes permisos para acceder a esta sección');
        }
    }

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            // sorter: false,
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            sorter: true,
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Nombre Completo',
            dataIndex: 'nombre',
            render: (_, record: User) => `${record.nombre} ${record.apell_materno} ${record.apell_paterno}`,
            sorter: true,
            filterOnClose: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Buscar nombre completo"
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
                        <Button onClick={() => handleReset(clearFilters,confirm)} size="small" style={{ width: 90 }}>
                            Limpiar
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Acciones',
            render: (_, record: User) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className={`container p-4 mx-auto ${theme}`}>
            <h1 className='mb-4 text-2xl font-bold text-center'>Bienvenido a la aplicación</h1>
            <p className='mb-4 text-center'>Aquí puedes ver la lista de usuarios</p>
            <div className='flex justify-end mb-4'>
                <Button className='mr-4' type='primary' onClick={handleCheckAdmin}  > Ver usuarios (Solo admin)</Button>
            </div>
            <div className='p-4 bg-white rounded shadow-md'>
                <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={users}
                    pagination={false}
                    loading={loading}
                    onChange={handleTableChange}

                />
                <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    showTotal={total => `Total ${total} items`}
                    pageSize={pagination.limit}
                    onChange={(page, size) => setPagination({ ...pagination, page, limit: size })}
                    defaultPageSize={10}
                    defaultCurrent={1}
                    pageSizeOptions={['10', '20', '30', '40', '50']}
                />
            </div>
            <Modal
                title="Edit User"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="usuario" label="Usuario" rules={[{ required: true, message: 'Por favor ingresa el usuario!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="correo" label="Email" rules={[{ required: true, message: 'Por favor ingresa el correo!' },{
                        type: 'email', message: 'Por favor ingresa un correo válido!'
                    }]}>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="apell_materno" label="Apellido Materno" rules={[{ required: true, message: 'Por favor ingresa el apellido materno!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="apell_paterno" label="Apellido Paterno" rules={[{ required: true, message: 'Por favor ingresa el apellido paterno!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Home;
