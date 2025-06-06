
export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
    met: false
  },
  {
    label: "Contains uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
    met: false
  },
  {
    label: "Contains lowercase letter", 
    test: (password: string) => /[a-z]/.test(password),
    met: false
  },
  {
    label: "Contains number",
    test: (password: string) => /\d/.test(password),
    met: false
  },
  {
    label: "Contains special character",
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    met: false
  }
];

export const validatePassword = (password: string): PasswordRequirement[] => {
  return passwordRequirements.map(req => ({
    ...req,
    met: req.test(password)
  }));
};

export const isPasswordStrong = (password: string): boolean => {
  return validatePassword(password).every(req => req.met);
};
