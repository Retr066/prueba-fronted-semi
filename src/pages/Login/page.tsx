import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import authServices from '../../services/authServices';
import { ErrorResponse } from '../../interfaces/response.interface';
import { ErrorResponseValidation } from '../../interfaces/error.interface';
import { LoginData } from '../../interfaces/auth.interface';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';



const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values: LoginData) => {
        console.log('Received values of form: ', values);
        try {
            const response = await authServices.login(values);
            console.log('Login response:', response.data);
            dispatch(setUser(response.data!.user));
            localStorage.setItem('user', JSON.stringify(response.data!.user));
            message.success(response.message);
            navigate('/home'); // Redirigir a la página de inicio
        } catch (error) {
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
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
                <Form
                    name="normal_login"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Ingresa tu correo electrónico!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Ingresa tu contraseña!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Iniciar Sesión
                        </Button>
                        <div className='mt-4 text-center'>
                          <Link to="/register">Regístrate Ahora</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
