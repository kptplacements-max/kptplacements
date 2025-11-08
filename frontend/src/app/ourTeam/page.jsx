"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function OurTeamPage() {
  const [team, setTeam] = useState([]);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/team`);
        setTeam(res.data);
      } catch (error) {
        console.error("Failed to load team:", error);
      }
    };
    fetchTeam();
  }, [baseURL]);

  return (
    <section className="min-h-screen bg-white text-gray-900 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2 text-blue-800">Our Team</h1>
        <p className="text-gray-600 mb-12">
          Meet the dedicated members of the Training & Placement Cell who work
          tirelessly to guide students toward successful careers.
        </p>

        {team.length === 0 ? (
          <p className="text-gray-500">No team members added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {team.map((member) => (
              <div
                key={member._id}
                className="group relative bg-white border border-gray-200 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="w-full h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={member.image?.url || "/placeholder.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {member.name}
                  </h3>
                  <p className="text-gray-700 text-sm mt-1">
                    {member.designation}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {member.department}
                  </p>

                  <div className="mt-3 flex flex-col justify-center gap-4 text-sm text-gray-500">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-blue-600"
                      >
                        📧 Email: {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="hover:text-blue-600"
                      >
                        📞 Call: {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
