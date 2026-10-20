import StatsCount from "@/components/ui/statscount";

const stats = [
  {
    value: 300,
    suffix: "+",
    label: "Vehicles Sold",
  },
  {
    value: 200,
    suffix: "K+",
    label: "Instagram Community",
  },
  {
    value: 98,
    suffix: "%",
    label: "Customer Satisfaction",
  },
];

export default function StatsSection() {
  return (
    <StatsCount
      stats={stats}
      title="TRUSTED BY THOUSANDS OF VEHICLE BUYERS ACROSS INDIA"
      showDividers={true}
      className=""
    />
  );
}
