import React, { useState } from 'react';
import { Region, Sector, JobRole } from '../types';
import { SECTORS_CATALOG } from '../data/sectorsData';
import { rankOpportunities } from '../services/mlEngine';
import { User, Briefcase, GraduationCap, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface YouthPortalViewProps {
  regions: Region[];
  onSelectRegion: (id: string) => void;
}

export const YouthPortalView: React.FC<YouthPortalViewProps> = ({
  regions,
  onSelectRegion
}) => {
  const [education, setEducation] = useState('B.Tech / B.E Engineering');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python & Data Analytics',
    'Machine Learning',
    'CAD & Engineering Design'
  ]);
  const [interest, setInterest] = useState('High-Tech & Digital Innovation');

  const availableSkillsList = [
    'Python & Data Analytics',
    'Machine Learning',
    'CAD & Engineering Design',
    'CNC Machining & Tooling',
    'Food Safety & Quality Testing',
    'Cold Chain & Warehouse Operations',
    'Solar PV Installation & SCADA',
    'Apparel Cutting & Textile Merchandising',
    'Heritage Hospitality & Guiding',
    'Cleanroom cGMP Pharma Operations'
  ];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Compute matched sectors based on user skills & interests
  const matches = React.useMemo(() => {
    const scoredSectors = SECTORS_CATALOG.map(sector => {
      let matchedSkillCount = 0;
      selectedSkills.forEach(us => {
        if (sector.keySkills.some(ks => ks.toLowerCase().includes(us.toLowerCase()) || us.toLowerCase().includes(ks.toLowerCase()))) {
          matchedSkillCount++;
        }
      });

      let matchScore = 35 + matchedSkillCount * 22;
      if (sector.name.toLowerCase().includes(interest.toLowerCase()) || sector.category.toLowerCase().includes(interest.toLowerCase())) {
        matchScore += 25;
      }
      matchScore = Math.min(96, Math.max(40, matchScore));

      // Find top 3 districts for this sector
      const topDistricts = regions
        .map(r => {
          const ops = rankOpportunities(r, 'balanced', [sector]);
          return {
            id: r.id,
            district: r.district,
            state: r.state,
            score: ops[0]?.score || 50
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        sector,
        matchScore,
        topDistricts
      };
    });

    return scoredSectors.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [education, selectedSkills, interest, regions]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#008C95]" />
          Youth Talent & Career Mobility
        </div>
        <h2 className="text-2xl font-bold text-[#173B63] mt-1">
          Student & Youth Regional Opportunity Matching
        </h2>
        <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
          Align your education and technical skills with high-growth regional sectors across India. Discover emerging career roles, required industry certifications, and local enterprise hubs.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-3.5 bg-[#EEF3F7] border border-[#8EC5CC] rounded-xl text-xs text-[#172B4D] flex items-center justify-between">
        <div>
          <span className="font-bold text-[#173B63]">Decision-Support Guidance: </span>
          <span className="text-[#5B6B7A]">
            These results indicate potential developmental matches based on empirical opportunity indices. They are intended for career exploration and skill development planning.
          </span>
        </div>
      </div>

      {/* User Input Profile Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-[#173B63]">Configure Your Career Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Education */}
          <div className="space-y-1.5">
            <label htmlFor="education-select" className="font-semibold text-[#172B4D]">Educational Qualification:</label>
            <select
              id="education-select"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95]"
            >
              <option value="B.Tech / B.E Engineering">B.Tech / B.E Engineering (Computer, Mechanical, Electrical)</option>
              <option value="B.Sc / M.Sc Basic Sciences">B.Sc / M.Sc Agriculture / Chemistry / Biotech</option>
              <option value="Polytechnic Diploma">Polytechnic Engineering Diploma</option>
              <option value="ITI Vocational Certificate">Industrial Training Institute (ITI) Certified</option>
              <option value="Degree in Commerce / Arts">Graduate in Commerce, Arts or Management</option>
            </select>
          </div>

          {/* Interest */}
          <div className="space-y-1.5">
            <label htmlFor="interest-select" className="font-semibold text-[#172B4D]">Primary Career Interest:</label>
            <select
              id="interest-select"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-3 py-2 bg-[#EEF3F7] border border-slate-200 rounded-lg text-[#172B4D] focus:outline-none focus:border-[#008C95]"
            >
              <option value="High-Tech & Digital Innovation">High-Tech, Software & Digital Economy</option>
              <option value="Agro-Processing & Food Tech">Agro-Processing, Food Science & Cold Chain</option>
              <option value="Green Energy & Clean Tech">Renewable Energy, Solar & Clean Tech</option>
              <option value="Precision Manufacturing">Precision Manufacturing & Defense Components</option>
              <option value="Multimodal Logistics">Supply Chain, Freight & Logistics</option>
              <option value="Cultural Tourism">Heritage Tourism, Hospitality & Cultural Arts</option>
            </select>
          </div>
        </div>

        {/* Technical Skills selection */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-[#173B63] block">Select Your Key Technical Skills & Competencies:</span>
          <div className="flex flex-wrap gap-2">
            {availableSkillsList.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    active
                      ? 'bg-[#173B63] text-white font-semibold shadow-xs'
                      : 'bg-[#EEF3F7] text-[#172B4D] hover:bg-slate-200'
                  }`}
                >
                  {active ? '✓ ' : '+ '}{skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matched Opportunities Output */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173B63]">
            Matched Opportunity Sectors & Regional Hubs
          </h3>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            Algorithmic alignment with local demand projections and district-level economic strengths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {matches.map((item, idx) => {
            const { sector, matchScore, topDistricts } = item;
            const cardColors = ['#008C95', '#173B63', '#F59E0B'];
            const cardBorder = cardColors[idx % cardColors.length];

            return (
              <div
                key={sector.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cardBorder }} />

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6B7A] font-bold">
                        Match #{idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-[#173B63] mt-0.5">{sector.name}</h4>
                      <div className="text-xs text-[#5B6B7A]">{sector.category}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black font-mono tabular-nums text-[#008C95]">{matchScore}%</span>
                      <span className="text-[10px] text-[#8795A1] block font-sans">Profile Match</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5B6B7A] leading-relaxed line-clamp-2">
                    {sector.description}
                  </p>

                  {/* Target Job Roles */}
                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    <span className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider">
                      Target High-Growth Roles:
                    </span>
                    <div className="space-y-1">
                      {sector.jobRoles.slice(0, 2).map(job => (
                        <div key={job.title} className="p-2 bg-[#EEF3F7] rounded border border-slate-200">
                          <div className="font-semibold text-[#173B63]">{job.title}</div>
                          <div className="text-[11px] text-[#5B6B7A]">{job.training}</div>
                          <div className="text-[11px] font-mono font-bold text-[#2E8B57] mt-0.5">
                            {job.averageSalaryBand}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Regional Growth Hubs */}
                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    <span className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider">
                      Promising Regional Clusters:
                    </span>
                    <div className="space-y-1">
                      {topDistricts.map(hub => (
                        <button
                          key={hub.id}
                          onClick={() => onSelectRegion(hub.id)}
                          className="w-full flex items-center justify-between p-2 bg-[#EEF3F7] hover:bg-[#DCEAF2] rounded text-left transition-colors cursor-pointer group"
                        >
                          <span className="font-medium text-[#172B4D] group-hover:text-[#173B63]">{hub.district}, {hub.state}</span>
                          <span className="font-mono font-bold text-[#008C95] text-[11px]">{hub.score}/100</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
