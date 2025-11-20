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

  // ⭐ Categorize into tree levels
  function sortToTree(list) {
    const principal = list.filter(
      (m) => m.designation?.toLowerCase() === "principal"
    );
    const tpo = list.filter((m) =>
      m.designation?.toLowerCase().includes("training & placement")
    );
    const spc = list.filter((m) =>
      m.designation?.toLowerCase().includes("coodenator") ||
      m.designation?.toLowerCase().includes("coordinator")
    );
    return { principal, tpo, spc };
  }

  const tree = sortToTree(team);

  return (
    <section className="min-h-screen bg-white text-gray-900 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2 text-blue-800">Our Team</h1>
        <p className="text-gray-600 mb-12">
          Meet the dedicated members of the Training & Placement Cell.
        </p>

        {/* ⭐ TREE CSS */}
        <style>
          {`
            .tree { display: flex; flex-direction: column; align-items: center; }
            .tree-level { display: flex; justify-content: center; gap: 40px; margin: 40px 0; }
            .node { text-align: center; width: 180px; }
            .node img {
              width: 120px;
              height: 120px;
              object-fit: cover;
              border-radius: 50%;
              border: 3px solid #1e4db7;
              margin: 0 auto;
            }
            .line-down {
              width: 2px;
              height: 35px;
              background: #1e4db7;
              margin: -10px auto 20px auto;
            }
          `}
        </style>

        {team.length === 0 ? (
          <p>No team members added yet.</p>
        ) : (
          <div className="tree">

            {/* === PRINCIPAL === */}
            {tree.principal.length > 0 && (
              <>
                <div className="tree-level">
                  {tree.principal.map((p) => (
                    <div key={p._id} className="node">
                      <img src={p.image?.url} alt={p.name} />
                      <h3 className="font-bold text-blue-800 mt-2">{p.name}</h3>
                      <p className="text-sm">{p.designation}</p>
                      <p className="text-xs text-gray-500">{p.department}</p>
                    </div>
                  ))}
                </div>
                <div className="line-down"></div>
              </>
            )}

            {/* === TPO === */}
            {tree.tpo.length > 0 && (
              <>
                <div className="tree-level">
                  {tree.tpo.map((t) => (
                    <div key={t._id} className="node">
                      <img src={t.image?.url} alt={t.name} />
                      <h3 className="font-bold text-blue-800 mt-2">{t.name}</h3>
                      <p className="text-sm">{t.designation}</p>
                      <p className="text-xs text-gray-500">{t.department}</p>
                    </div>
                  ))}
                </div>
                <div className="line-down"></div>
              </>
            )}

            {/* === STUDENT PLACEMENT COORDINATORS === */}
            <div className="tree-level flex flex-wrap justify-center gap-10">
              {tree.spc.map((s) => (
                <div key={s._id} className="node">
                  <img src={s.image?.url} alt={s.name} />
                  <h3 className="font-semibold text-blue-800 mt-2">{s.name}</h3>
                  <p className="text-sm">{s.designation}</p>
                  <p className="text-xs text-gray-500">{s.department}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
