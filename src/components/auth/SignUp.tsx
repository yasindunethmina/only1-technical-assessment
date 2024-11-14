import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Label, Input, Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { signUpSchema, type SignUpInputs } from '../../schemas/auth';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpInputs) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error?.message || 'Failed to create account. Please try again!'
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">PermissionPro</h1>
          <p className="text-gray-600 mt-2">
            Create your account to get started
          </p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </Label>
                  <Input
                    {...field}
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

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

          <div>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </Label>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="text-sm text-gray-600">
            <h3 className="font-medium mb-2">Password Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase letter</li>
              <li>Contains lowercase letter</li>
              <li>Contains number</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;