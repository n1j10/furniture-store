import { Separator } from "@/components/ui/separator";
import SidebarComponent from "./Sidebar";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (userId !== process.env.ADMIN_USER_ID) redirect('/');
  return (
    <main>
      <h2 >DashBoard</h2>
      <Separator className='mt-2'/>
      <section className="grid lg:grid-cols-12 gap-1 mt-12">
        <div className="lg: col-span-2">
          <SidebarComponent />
        </div>
        <div className=" lg:col-4 px-4">
          {children}
        </div>
      </section>



    </main>
  );
}
