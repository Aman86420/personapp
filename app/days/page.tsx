import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DaysPage } from "@/app/components/DaysPage";

export default async function DaysRoutePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <DaysPage />
    );
}
