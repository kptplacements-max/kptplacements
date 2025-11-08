import { Building2, Users, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
          Training & Placement Cell
        </h1>
        <p className="text-black text-lg mb-8 text-center max-w-xl">
          Karnataka Govt. Polytechnic, Mangalore – Bridging Academia and
          Industry.
        </p>
        <div className="flex gap-8 text-black">
          <div className="flex flex-col items-center">
            <Users className="h-10 w-10 text-blue-500" />
            <span>1500+ Students</span>
          </div>
          <div className="flex flex-col items-center">
            <Building2 className="h-10 w-10 text-green-500" />
            <span>100+ Recruiters</span>
          </div>
          <div className="flex flex-col items-center">
            <GraduationCap className="h-10 w-10 text-orange-500" />
            <span>8 Departments</span>
          </div>
        </div>
      </section>
    </>
  );
}
