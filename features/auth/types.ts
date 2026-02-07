export type SignInForm = {
  username: string;
  password: string;
};

export type SignUpForm = {
  email: string;
  name: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
};