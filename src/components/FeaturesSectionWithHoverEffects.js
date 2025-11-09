import { cn } from "../lib/utils";
import {
  Settings,
  Cloud,
  DollarSign,
  Zap,
  Heart,
  HelpCircle,
  Navigation,
  Terminal,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Auto Syndicate",
      description: "AI-powered matching with like-minded investors for seamless co-ownership opportunities.",
      icon: <Terminal />,
    },
    {
      title: "Dynamic Liquidity",
      description: "Monthly liquidity windows with reverse-bidding mechanics for flexible asset trading.",
      icon: <Zap />,
    },
    {
      title: "AI Assistant",
      description: "Personalized investment recommendations based on your goals and risk profile.",
      icon: <DollarSign />,
    },
    {
      title: "Impact Meter",
      description: "Track your ESG impact with gamified scoring and achievement badges.",
      icon: <Cloud />,
    },
    {
      title: "Smart Portfolio",
      description: "Automated diversification across asset classes with risk management.",
      icon: <Navigation />,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance from our investment specialists and AI agents.",
      icon: <HelpCircle />,
    },
    {
      title: "Secure Trading",
      description: "Bank-grade security with multi-factor authentication and cold storage.",
      icon: <Settings />,
    },
    {
      title: "Community Driven",
      description: "Connect with fellow investors and share insights in our exclusive community.",
      icon: <Heart />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {/* Orange hover overlays */}
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-orange-100 dark:from-orange-800/30 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-orange-100 dark:from-orange-800/30 to-transparent pointer-events-none" />
      )}

      {/* Icon */}
      <div className="mb-4 relative z-10 px-10 text-white dark:text-neutral-300 group-hover/feature:text-orange-500 transition-colors duration-300">
        {icon}
      </div>

      {/* Title with orange accent bar */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-orange-300 dark:bg-orange-700 group-hover/feature:bg-orange-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-700 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
