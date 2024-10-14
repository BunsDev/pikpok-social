import WelcomeSvg from "@src/svgs/WelcomeSvg";

const Home = () => {
  return (
    <div className="h-[calc(100vh-72px)] w-full flex items-center flex-col justify-center gap-y-16">
      <WelcomeSvg />
      <h1 className="text-xl text-primary-color font-semibold">
        Welcome! Click on any contents you want above!
      </h1>
    </div>
  );
};

export default Home;
