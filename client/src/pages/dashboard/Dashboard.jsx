import React from 'react';
import { 
  IndianRupee, 
  Building2, 
  Users, 
  TrendingDown, 
  TrendingUp, 
  Download,
  Eye
} from 'lucide-react';

const StatCard = ({ title, value, trend, isPositive, icon: Icon, iconColor, iconBg }) => (
  <div className="bg-white-100 rounded-xl p-4 border border-stroke flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-black-90/60 font-medium text-sm">{title}</h4>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className={iconColor} size={20} />
      </div>
    </div>
    <div>
      <h2 className="text-3xl font-bold text-black-90 mb-2">{value}</h2>
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${isPositive ? 'bg-success/10 text-success' : 'bg-alert/10 text-alert'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend} from last month
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, count, percent, colorClass }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between text-sm mb-1.5">
      <span className="font-bold text-black-90">{label}</span>
      <span className="text-black-90/60 font-medium">({count})</span>
    </div>
    <div className="w-full bg-gray rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-primary mb-1">Dashboard</h1>
          <p className="text-sm font-medium text-black-90/60">
            Welcome back, <span className="text-primary">Johnson Doe</span>. Here's your ecosystem overview
          </p>
        </div>
        <button className="flex items-center gap-2 bg-secondary text-white-100 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="₹483,500" 
          trend="12.05%" 
          isPositive={true} 
          icon={IndianRupee} 
          iconColor="text-secondary" 
          iconBg="bg-secondary/10" 
        />
        <StatCard 
          title="Active Tenants" 
          value="3,128" 
          trend="5%" 
          isPositive={false} 
          icon={Building2} 
          iconColor="text-success" 
          iconBg="bg-success/10" 
        />
        <StatCard 
          title="Active Users" 
          value="24,560" 
          trend="5%" 
          isPositive={true} 
          icon={Users} 
          iconColor="text-alert" 
          iconBg="bg-alert/10" 
        />
        <StatCard 
          title="Tenant Churn Rate" 
          value="2.46%" 
          trend="5%" 
          isPositive={false} 
          icon={TrendingDown} 
          iconColor="text-purple" 
          iconBg="bg-purple/10" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Bar Chart */}
        <div className="bg-white-100 rounded-xl p-6 border border-stroke">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-black-90">Monthly vs Yearly Revenue</h3>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray rounded-lg p-1">
                <button className="px-4 py-1.5 rounded-md text-sm font-bold bg-primary text-white-100">Monthly</button>
                <button className="px-4 py-1.5 rounded-md text-sm font-medium text-black-90/60 hover:text-black-90">Yearly</button>
              </div>
              <select className="border border-stroke rounded-lg px-3 py-1.5 text-sm font-medium bg-white-100 text-black-90 outline-none focus:border-primary">
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>
          <div className="h-[250px] flex items-end justify-between gap-2 mt-4 relative pt-6 border-b border-stroke pb-6">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs font-medium text-black-90/40 text-right pr-2">
              <span>₹80k</span>
              <span>₹60k</span>
              <span>₹40k</span>
              <span>₹20k</span>
              <span>₹0k</span>
            </div>
            {/* Dummy bars */}
            <div className="flex-1 flex items-end justify-around pl-8 h-full">
              {[
                { m: 'Jan', v: 30 }, { m: 'Feb', v: 50 }, { m: 'March', v: 10 }, 
                { m: 'April', v: 70 }, { m: 'May', v: 50 }, { m: 'June', v: 60 }, 
                { m: 'July', v: 45 }, { m: 'Aug', v: 50 }, { m: 'Sep', v: 70 }, 
                { m: 'Oct', v: 30 }, { m: 'Nov', v: 50 }, { m: 'Dec', v: 60 }
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full px-1.5">
                  <span className="text-xs font-bold text-black-90/60 opacity-0 group-hover:opacity-100 transition-opacity">₹{d.v}k</span>
                  <div className="w-full bg-secondary rounded-t-sm transition-all duration-300 hover:bg-primary" style={{ height: `${(d.v / 80) * 100}%` }}></div>
                  <span className="text-xs font-medium text-black-90/60 absolute -bottom-6">{d.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Adoption */}
        <div className="bg-white-100 rounded-xl p-6 border border-stroke">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-black-90">Product Adoption</h3>
            <p className="text-xs font-medium text-black-90/60 mt-1">Top 5 products by active Tenants</p>
          </div>
          <div className="flex flex-col justify-center h-[250px]">
            <ProgressBar label="1 g-CRM" count="1253" percent={85} colorClass="bg-primary" />
            <ProgressBar label="2 g-HRMS" count="1200" percent={65} colorClass="bg-purple" />
            <ProgressBar label="3 g-Edupath" count="1100" percent={55} colorClass="bg-success" />
            <ProgressBar label="4 g-Sign" count="1000" percent={45} colorClass="bg-alert" />
            <ProgressBar label="5 g-Vendor" count="950" percent={30} colorClass="bg-secondary" />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="bg-white-100 rounded-xl border border-stroke overflow-hidden">
          <div className="p-5 border-b border-stroke flex justify-between items-center">
            <h3 className="font-bold text-lg text-black-90">Recent Tenants</h3>
            <button className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              View All Tenants <span className="text-lg">›</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray/50 border-b border-stroke">
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase">ID</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase">Tenant Name</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase text-center">Status</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="border-b border-stroke last:border-0 hover:bg-gray/20 transition-colors">
                    <td className="py-4 px-5 text-sm font-bold text-black-90">#001</td>
                    <td className="py-4 px-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        ABC
                      </div>
                      <span className="text-sm font-bold text-black-90">ABC Company Pvt Ltd</span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-warning/10 text-warning">
                        Yet to Onboard
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button className="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="bg-white-100 rounded-xl border border-stroke overflow-hidden">
          <div className="p-5 border-b border-stroke flex justify-between items-center">
            <h3 className="font-bold text-lg text-black-90">Recent Support Tickets</h3>
            <button className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              View All Support Tickets <span className="text-lg">›</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray/50 border-b border-stroke">
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase">Ticket ID</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase">Tenant Name</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase">Assigned Agent</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase text-center">Priority</th>
                  <th className="py-3 px-5 text-xs font-semibold text-black-90/60 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prio: 'High', c: 'bg-alert/10 text-alert', n: 'Johnson Doe' },
                  { prio: 'Medium', c: 'bg-success/10 text-success', n: 'Jane Doe' },
                  { prio: 'Low', c: 'bg-warning/10 text-warning', n: 'Tony Stark' }
                ].map((ticket, i) => (
                  <tr key={i} className="border-b border-stroke last:border-0 hover:bg-gray/20 transition-colors">
                    <td className="py-4 px-5 text-sm font-bold text-black-90">#001</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-sm font-bold text-black-90">{ticket.n}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm font-medium text-black-90/80">Jane Doe</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex w-full justify-center px-2.5 py-1 rounded-md text-xs font-bold ${ticket.c}`}>
                        {ticket.prio}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button className="w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
