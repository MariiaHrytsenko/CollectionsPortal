
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
    email: string;
    userName: string; // ✅ Замість "username"
    password: string;
}

export async function register(data: RegisterDto): Promise<void> {
    const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to register');
    }
}

export async function login(data: LoginDto): Promise<{ token: string }> {
  const res = await fetch('/api/account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to login');
  }

  return res.json();
}
