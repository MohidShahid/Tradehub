import Logo from "../assets/logo.png";
const Footer = () => {
  return (
    <div>
      <div>
        <div className="flex items-center gap-2">
          <img src={Logo} alt="" width={50} height={50} />
          <div>
            <span className="flex font-bold text-[24px]">
              <p className="text-white">Trade</p>
              <p className="text-(--color-accent) ">Hub</p>
            </span>
            <p className="text-[8px] text-(--color-text-muted)">
              Multiple Sellers . One Marketplace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
