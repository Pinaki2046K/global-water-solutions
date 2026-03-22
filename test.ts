import { prisma } from "./lib/db"; async function m() { console.log(await prisma.service.findMany({ select: { nextServiceDueDate: true, customer: { select: { name: true } } } })); }; m();
