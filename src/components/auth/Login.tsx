import { useForm, Controller } from 'react-hook-form';
import { Form, Label, Input, Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginInputs } from '../../schemas/auth';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginInputs) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">PermissionPro</h1>
          <p className="text-gray-600 mt-2">
            Login to your account to continue
          </p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </Label>
                  <Input
                    {...field}
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </Label>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>

          <p className="mt-4 text-center text-xs italic text-gray-600">
            Demo Account: Email: <strong>yasindu@gmail.com</strong> Password:{' '}
            <strong>Yasindu123</strong> (You can also create your own account
            using Sign Up)
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
