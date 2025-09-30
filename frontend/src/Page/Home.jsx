import Boxs from "../components/Boxs"
import Buttom from "../components/Buttom"
import Search from "../components/Search"
import Selection from "../components/Selection"

const Home = () => {
  return (
    <div className="home">
      <Search />
      <Selection />
      <Boxs/>
      <Buttom/>
    </div>
  )
}

export default Home