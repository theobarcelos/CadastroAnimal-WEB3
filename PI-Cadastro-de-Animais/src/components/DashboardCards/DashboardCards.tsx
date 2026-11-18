"use client";

import { useEffect, useState } from "react";
import "./DashboardCards.css";

import {
  PawPrint,
  Heart,
  FileClock,
  Syringe,
} from "lucide-react";

export default function DashboardCards() {

  const [qtdVacina, setQtdVacina] = useState(0);

  const cards = [
    {
      title: "Animais Cadastrados",
      value: "1.248",
      icon: <PawPrint />,
    },

    {
      title: "Adoções do Mês",
      value: "27",
      icon: <Heart />,
    },

    {
      title: "Solicitações Pendentes",
      value: "14",
      icon: <FileClock />,
    },

    {
      title: "Vacinas Registradas",
      value: qtdVacina,
      icon: <Syringe />,
    },
  ];

  const quantidadeVacina = async () => {
    try {
      const url = await fetch("http://localhost:3010/qtdVacina");
      const quantidade = await url.json();
      setQtdVacina(quantidade.qtd);
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    quantidadeVacina();
  }, [])

  return (
    <div className="cards-container">

      {cards.map((card, index) => (
        <div
          className="dashboard-card"
          key={index}
        >

          <div className="card-icon">
            {card.icon}
          </div>

          <div>

            <h2>{card.value}</h2>

            <p>{card.title}</p>

          </div>

        </div>
      ))}

    </div>
  );
}