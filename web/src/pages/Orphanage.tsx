import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo, FiMail } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import happyMapIcon from '../utils/happyMapIcon';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanage.css';

interface Orphanage {
    name: string;
    latitude: number;
    longitude: number;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: string;
    whatsapp: string;
    email: string;
    images: Array<{
      url: string;
      id: number;
    }>
}

interface OrphanageParams {
  id: string;
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();
  const [ orphanage, setOrphanage ] = useState<Orphanage>();
  const [ activeImageIndex, setActiveImageIndex ] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanage(response.data);
    })
  }, [params.id]); // Array de dependências

  if(!orphanage) {
    return <p>Carregando...</p>
  }


  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

          <div className="images">
            { orphanage.images.map((image, index) => {
              return (
                <button key={image.id} className={activeImageIndex === index ? 'active' : ''} type="button" 
                onClick={() => {
                  setActiveImageIndex(index);
                }}>
                 <img src={image.url} alt={orphanage.name} />
              </button>
              )
            }) }     
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude,orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              { orphanage.open_on_weekends ? (
              <div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
            </div>
              ) : (
              <div className="open-on-weekends dont-open">
                <FiInfo size={32} color="#ff6690" />
                Não Atendemos <br />
                fim de semana
              </div>
              ) }
            </div>

            <a target="_blank" href={`https://api.whatsapp.com/send?phone=55${orphanage.whatsapp}`} className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato pelo WhatsApp
            </a>

              <a target="_blank" href={`mailto:${orphanage.email}`} className="contact-button email">
                <FiMail size={20} color="#FFF" />
                Entrar em contato pelo E-mail
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}