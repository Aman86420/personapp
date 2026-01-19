import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FormCard } from "@/app/components/FormCard";

export default async function HomePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <FormCard />
        </div>
    );
}
