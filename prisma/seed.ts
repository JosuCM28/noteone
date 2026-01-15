import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
async function main() {
    const passwordHash = await bcrypt.hash('hola123', 12);
    const user = await prisma.user.create({
        data: {
            name: "Daniel Pimentel",
            email: "daniel@example.com",
            username: "daniel",
        },
    });
    console.log(user);
    await prisma.account.create({
        data: {
            accountId: "12345",
            userId: user.id,
            providerId: "google",
            password: passwordHash,

        },
    });
    console.log("Seeded successfully");

}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});