export default function ResumeCard({ livro, resumo }) {
    return (
        <>
            <div className="bg-lime-800/75 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 mt-5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-yellow-500 rounded-xl flex items-center justify-center ">
                        <span className="text-2xl">💬</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Resumo das reviews do livro "{livro}"
                    </h2>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[17px]">
                        {resumo ||
                            "Os usuários destacaram a excelente qualidade do produto, facilidade de uso e o bom atendimento. Alguns mencionaram que gostariam de mais opções de cores, mas no geral a satisfação foi muito alta."
                        }
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm text-yellow-50">
                    <span>Baseado em comentários recentes</span>

                </div>
            </div>

        </>
    )
}