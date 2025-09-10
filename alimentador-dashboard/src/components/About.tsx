import React from 'react';
import './About.css';

import placeholder from '../assets/Portrait_Placeholder.png';

const participants = [
  {
    name: 'Gabriel Castello Ayres Nalesso',
    linkedin: 'https://www.linkedin.com/in/gabriel-castello-branco-50b533378/',
    photo: placeholder
  },
  {
    name: 'Maurice Golin Soares dos Santos',
    linkedin: 'https://www.linkedin.com/in/mauricegss/',
    photo: 'https://media.licdn.com/dms/image/v2/D4D03AQHp_g1xQ1_hPw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1729034616157?e=1759363200&v=beta&t=wXlzsOzzHIurXxyZ-zYwYxXGZvvKjnF_jG5_UczHXZ4'
  },
  {
    name: 'Nicolas Cardoso Motta',
    linkedin: 'https://www.linkedin.com/in/nicolassmotta/',
    photo: 'https://media.licdn.com/dms/image/v2/D4D03AQGYBK-VgwxrBw/profile-displayphoto-shrink_400_400/B4DZbGvcc.HEAg-/0/1747091049172?e=1759363200&v=beta&t=lIG1PiGmxFDeO3rQUwo223SN2cXADGcDeRrQCZeBvis'
  },
  {
    name: 'Vinicius A. de Oliveira Hashizume',
    linkedin: 'https://www.linkedin.com/in/vinicius-hashizume/',
    photo: 'https://media.licdn.com/dms/image/v2/D4E03AQGtmdqBJky-2g/profile-displayphoto-scale_400_400/B4EZhh1CmdHEAk-/0/1753987953319?e=1759363200&v=beta&t=6ODANLpDqUZqKxGCk124nX83O1C5sSqTHLVN6JhW3BQ' 
  }
];

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">Sobre o Projeto</h1>
      <p className="about-description">
        O projeto é uma iniciativa direcionada à criação de uma ferramenta digital com o propósito de simplificar a verificação do nível de ração nos comedouros utilizados para alimentar os cachorros na Universidade Tecnológica Federal do Paraná.
      </p>
      <p className="about-description">
        Através de um microcontrolador ESP 8266 e um sensor de distância ultrassônico HC-SR04, o sistema foi projetado para fornecer suporte aos responsáveis pelo abastecimento dos comedouros, oferecendo uma interface intuitiva que exibe a quantidade de ração disponível em porcentagem.
      </p>
       <p className="about-description">
        Além disso, o desenvolvimento do projeto busca inovar, adaptando-se às necessidades do ambiente universitário e integrando novas tecnologias para aprimorar a gestão do suprimento alimentar. O objetivo é contribuir para a melhoria da qualidade do monitoramento, tornando o processo mais acessível, dinâmico e eficaz.
      </p>
      <h2 className="team-title">Equipe de Desenvolvimento</h2>
      <div className="participants-grid">
        {participants.map((participant, index) => (
          <div className="participant-card" key={index}>
            <img src={participant.photo} alt={`Foto de ${participant.name}`} className="participant-photo" />
            <h3 className="participant-name">{participant.name}</h3>
            <a href={participant.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link">
              LinkedIn
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;