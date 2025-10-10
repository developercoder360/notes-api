export const jwtConstants = {
    secret: process.env.JWT_SECRET,

    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),

};
