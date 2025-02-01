
interface FeatureCardProps{
    className?: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const FeatureCard = ({
  className,
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div
      className={`${className} p-6 border border-charcoal-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-charcoal-6 to-charcoal-8 flex flex-col justify-center items-start space-y-4`}
    >
      <Icon
        className={
          "text-5xl text-cobalt-3 p-2 rounded-lg bg-charcoal-7 border border-charcoal-4"
        }
      />
      <div className="text-3xl font-mono font-bold text-cobalt-6">{title}</div>
      <div className="text-lg font-mono text-cobalt-3">{description}</div>
    </div>
  );
};

export default FeatureCard
