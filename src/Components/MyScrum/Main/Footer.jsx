import './Footer.css';

function Footer () {
    return (
        <footer className="container-fluid bg-dark text-light py-3">
        <div className="row">
          <div className="col-md-4 text-md-left d-none d-md-block">
            <p className='footer-project'>Projeto 5</p>
          </div>
          <div className="col-12 col-md-4">
            <p className="footer-author">&copy; Pedro Domingos</p>
          </div>
          <div className="col-12 col-md-4">
            <p className='footer-discipline'>Programação Avançada em Java</p>
          </div>
        </div>
      </footer>
    )
}
export default Footer;