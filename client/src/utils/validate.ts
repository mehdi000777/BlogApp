import { IBlog } from "./Typescript";

export const valid = (name: string, account: string, password: string, cf_Password: string) => {
    let errors = [];

    if (!name) {
        errors.push("Please enter your name.");
    } else if (name.length > 25) {
        errors.push("Your name is up to 20 chars long.");
    }

    if (!account) {
        errors.push("Please enter your email or phone.");
    } else if (!validateEmail(account) && !validatePhone(account)) {
        errors.push("Email or phone number format is incorrect.");
    }

    if (!password) {
        errors.push("Please enter your password.");
    }

    const msg = checkPassword(password, cf_Password);
    if (msg) {
        errors.push(...msg);
    }

    return errors;
}

export const checkPassword = (password: string, cf_Password: string) => {
    let errors = [];

    if (password.length < 6) {
        errors.push("Password must be at least 6 chars.");
    } else if (password !== cf_Password) {
        errors.push("Confirm password did not match.");
    }

    return errors;
}

export function validatePhone(phone: string) {
    const re = /^[+]\d{10}/g; // eslint-disable-line
    return re.test(phone);
}

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return re.test(String(email).toLocaleLowerCase());
}


// validate blog
export const validateCreateBlog = ({ title, content, description, thumbnail, category }: IBlog) => {
    let err = [];

    if (title.trim().length < 10) {
        err.push("Title has at least 10 charecters.");
    } else if (title.trim().length > 50) {
        err.push("Title is up to 50 charecters long.");
    }

    if (content.trim().length < 2000) {
        err.push("Content has at least 2000 charecters.");
    }

    if (description.trim().length < 50) {
        err.push("Description has at least 50 charecters.");
    } else if (description.trim().length > 200) {
        err.push("Description is up to 200 charecters long.");
    }

    if (!thumbnail) {
        err.push("Thumbnail cannot be left blank.")
    }

    if (!category) {
        err.push("Category cannot be left blank.")
    }

    return err;
}


export const shallowEqual = (object1: any, object2: any) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            console.log({ 1: object1[key], 2: object2[key] })
            return false;
        }
    }

    return true;
}