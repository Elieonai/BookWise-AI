function StatsSection() {
  const stats = [
    {
      id: 1,
      icon: "📚",
      value: "120+",
      label: "Livros cadastrados",
    },
    {
      id: 2,
      icon: "⭐",
      value: "450+",
      label: "Avaliações",
    },
    {
      id: 3,
      icon: "👥",
      value: "Comunidade",
      label: "Leitores ativos",
    },
    {
      id: 4,
      icon: "🤖",
      value: "IA",
      label: "Recomendações inteligentes",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>

            <h3 className="text-2xl font-bold text-gray-900">
              {stat.value}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsSection;