import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import authServices from '../../services/authServices';
import { RegisterData } from '../../interfaces/auth.interface';
import {  ErrorResponseValidation } from '../../interfaces/error.interface';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from '../../interfaces/response.interface';


const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<RegisterData>();
    const navigate = useNavigate();

    const onFinish = async (values: RegisterData) => {
        setLoading(true);
        try {
            const response = await authServices.register(values);
            message.success(response.message);
            form.resetFields();
            navigate('/login');
        } catch (error: unknown) {
            const  e = error as ErrorResponse;
            if (e?.message) {
                message.error(e.message);
            } else {
                const e = error as ErrorResponseValidation
                if ('errors' in e) {
                    e.errors.forEach(error => {
                        message.error(error.msg);
                    });
                }else{
                    console.log('Registration error:', error);
                    message.error('Ocurrió un error');
                }
            } 
           
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="md:container md:mx-auto flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-8">Registro</h2>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Ingresa tu nombre de usuario!' }]}
                    >
                        <Input placeholder="Nombre de usuario" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[{
                            required: true, message: 'Ingresa tu correo electrónico!',

                        }, {
                            type: 'email', message: 'Ingresa un correo válido!'
                        }]}
                    >
                        <Input placeholder="Correo electrónico" type='email' />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Ingresa tu nombre!' }]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>


                    <Form.Item
                        name="second_lastname"
                        rules={[{ required: true, message: 'Ingresa tu apellido materno!' }]}
                    >
                        <Input placeholder="Apellido materno" />
                    </Form.Item>

                    <Form.Item
                        name="lastname"
                        rules={[{ required: true, message: 'Ingresa tu apellido paterno!' }]}
                    >
                        <Input placeholder="Apellido paterno" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Ingresa tu contraseña!' }]}
                    >
                        <Input.Password placeholder="Contraseña"  />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Confirma tu contraseña!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Las contraseñas no coinciden!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirmar contraseña" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                            Registrar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
