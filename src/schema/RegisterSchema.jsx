import * as zod from "zod"

const schema = zod.object({
    name: zod.string().nonempty('Name is required').min(3, 'Name min 3 characters').max(10, 'Name can not exceed 10 characters'),
    email: zod.string().nonempty('Email is required').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid Email'),
    password: zod.string().nonempty('Password is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, 'Invalid password'),
    gender: zod.string().nonempty('Gender is required'),
    rePassword: zod.string().nonempty('rePassword is required'),
    dateOfBirth: zod.coerce.date().refine((value) => {
        const year = value.getFullYear()
        const yearNow = new Date().getFullYear()
        const userAge = yearNow - year
        return userAge >= 20
    }, { message: 'Age must be at least 20' })
}).refine((data) => data.password === data.rePassword, { path: ['rePassword'], message: 'Passwords do not match' })

export default schema