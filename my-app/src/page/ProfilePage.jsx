import React from 'react';
import './Profile.css';
import {
  MDBCardImage,
} from 'mdb-react-ui-kit';


export default function ProfilePage({ user = {}, reference }) {
  const {
    _id,
    nom,
    prenom,
    email,
    password,
    role
  } = user
  return (
    <div className="profile">
      <div>
        <MDBCardImage
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
          alt="avatar"
          className="rounded-circle avatar-image"
        />
        <p className="text">{[prenom, nom].join(' ')}: {reference} </p>
        <p className="text-success">Robot connecté</p>
      </div>
      <div>
        <div>
          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Nom</span>
              <span className="info-value">{nom} </span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Prénom</span>
              <span className="info-value">{prenom}</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{email}</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Mot de passe </span>
              <span className="info-value">  *******</span>
            </div>
            <hr />
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="info-value">{role}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}