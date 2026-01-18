import { z } from 'zod';

const schema = z.object({
    password: z
        .string()
        .min(1, "Current password is required"),
    
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        )
}).refine(data => data.password !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});

export default schema;