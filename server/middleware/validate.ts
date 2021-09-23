import { Request, Response, NextFunction } from 'express';


export const validRegister = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, account, password } = req.body;

        const errors = [];

        if (!name) {
            errors.push("Please enter your name.");
        } else if (name > 25) {
            errors.push("Your name is up to 20 chars long.");
        }

        if (!account) {
            errors.push("Please enter your email or phone.");
        } else if (!validateEmail(account) && !validatePhone(account)) {
            errors.push("Email or phone number format is incorrect.");
        }

        if (!password) {
            errors.push("Please enter your password.");
        } else if (password.length < 6) {
            errors.push("Password must be at least 6 chars.")
        }

        if (errors.length > 0) return res.status(400).send({ msg: errors });

        next();

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
}

export function validatePhone(phone: string) {
    const re = /^[+]\d{10}/g;
    return re.test(phone);
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLocaleLowerCase());
}


export const validateBlog = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, thumbnail, category, content, description } = req.body;

        let errors = [];

        if (title.trim().length < 10) {
            errors.push("Title has at least 10 charecters.");
        } else if (title.trim().length > 50) {
            errors.push("Title is up to 50 charecters long.");
        }

        if (content.trim().length < 2000) {
            errors.push("Content has at least 2000 charecters.");
        }

        if (description.trim().length < 50) {
            errors.push("Description has at least 50 charecters.");
        } else if (description.trim().length > 200) {
            errors.push("Description is up to 200 charecters long.");
        }

        if (!thumbnail) {
            errors.push("Thumbnail cannot be left blank.")
        }

        if (!category) {
            errors.push("Category cannot be left blank.")
        }

        if (errors.length !== 0) return res.status(400).send({ msg: errors });

        next();

    } catch (err: any) {
        res.status(500).send({ msg: err.message });
    }
}