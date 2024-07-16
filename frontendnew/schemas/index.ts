import * as z from 'zod';

// Custom validation function to check if the email is from allowed domains
function isValidEmailProvider(email:string) {
    const allowedDomains = ['gmail.com', 'icloud.com', 'outlook.com', 'yahoo.com'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
}

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Invalid email format'
    }).refine(email => isValidEmailProvider(email), {
        message: 'Email must be from Gmail, iCloud, Outlook, or Yahoo'
    }),
    password: z.string().min(1, {
        message: 'Password is required'
    })
});



export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Invalid email format'
    }).refine(email => isValidEmailProvider(email), {
        message: 'Email must be from Gmail, iCloud, Outlook, or Yahoo'
    }),
    password: z.string().min(6, {
        message: 'Minimum 6 characters required'
    }),
    name:z.string().min(1,{
        message:'Name is required'
    })
});
