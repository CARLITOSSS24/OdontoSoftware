import React from "react";

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const Footer = () => (
  <footer
    style={{
      width: "100%",
      background: palette.primary,
      color: "#fff",
      padding: "1.5rem 0 1rem 0",
      textAlign: "center",
      fontWeight: 500,
      letterSpacing: 1,
      fontSize: 16,
      marginTop: "auto"
    }}
  >
    <div style={{ marginBottom: 6 }}>
      Dra. Yamile Guzman &mdash; Especialista en Periodoncia e Implantología
    </div>
    <div style={{ marginBottom: 6 }}>
      Clínica Odontomedical &nbsp;|&nbsp; Cel: <a href="tel:3134833332" style={{ color: "#fff", textDecoration: "underline dotted" }}>3134833332</a> &nbsp;|&nbsp; Fijo: <a href="tel:(601)4124787" style={{ color: "#fff", textDecoration: "underline dotted" }}> (601) 4124787</a>
    </div>
    <div style={{ marginBottom: 6 }}>
      Crr 75 # 25c - 34, Bogotá, Colombia
    </div>
    <div style={{ fontSize: 14, color: palette.grayLight, marginTop: 8 }}>
      © {new Date().getFullYear()} Odontomedical. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;