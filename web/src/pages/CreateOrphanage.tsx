import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import happyMapIcon from '../utils/happyMapIcon';

import Sidebar from '../components/Sidebar';

import { FiPlus } from 'react-icons/fi';


import api from '../services/api';

import '../styles/pages/create-orphanage.css';


export default function CreateOrphanage() {
  const history = useHistory();

  const [ position, setPosition ] = useState({ latitude: 0, longitude: 0 });

  const [ name, setName ] = useState('');
  const [ about, setAbout ] = useState('');
  const [ instructions, setInstructions ] = useState('');
  const [ opening_hours, setOpening_hours ] = useState('');
  const [ open_on_weekends, setOpen_on_weekends  ] = useState(true);
  const [ whatsapp, setWhatsapp  ] = useState('');
  const [ email, setEmail  ] = useState('');
  const [ images, setImages ] = useState<File[]>([]);
  const [ previewImages, setPreviewImages ] = useState<string[]>([]);


  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {

    if(!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(selectedImage => 
      URL.createObjectURL(selectedImage));

    setPreviewImages(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    data.append('whatsapp', whatsapp);
    data.append('email', email);

    images.forEach(image => data.append('images', image));

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');
  }

   return (
    <div id="page-create-orphanage">
   
    <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-23.5822585,-46.4083668]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { position.latitude !== 0 && ( 
               <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} />
              )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

             <div className="input-block">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input id="whatsapp" placeholder="119999999" value={whatsapp} onChange={event => setWhatsapp(event.target.value)} />
            </div>

             <div className="input-block">
              <label htmlFor="email">E-mail</label>
              <input id="email" placeholder="exemplo@email.com" type="email" value={email} onChange={event => setEmail(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                  { previewImages.map(image => (
                    <img key={image} src={image} alt={name}/>
                  )) }

                  <label htmlFor="image[]" className="new-image">
                    <FiPlus size={24} color="#15b6d6" />
                  </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Atendimento</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpening_hours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={ open_on_weekends ? 'active' : ''}
                  onClick={() => setOpen_on_weekends(true)}
                >
                  Sim
                </button>
                <button type="button" className={ open_on_weekends ? '' : 'active no'}
                onClick={() => setOpen_on_weekends(false)}
                >
                  Não
                  </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
