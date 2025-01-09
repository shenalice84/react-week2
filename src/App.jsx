import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH

function App() {
  // 設定狀態

  const [isAuth, setIsAuth] = useState(false);
  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([])

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handLogin = async(e) => {
    e.preventDefault();
    // axios.post(url, data, config)
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account)
      const { token, expired } = res.data;

      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`)
        setProducts(res.data.products)
      } catch(err) {
        console.log(err)
      }
      setIsAuth(true)
    } catch(err) {
      console.log(err)
    }
  };

  const checkUserLogin = async() => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert('已登入')
    } catch (err){
      console.log(err)
    }
  }

  return (
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col-6">
              <button onClick={checkUserLogin} type="button" className="btn btn-success mb-4">檢查是否登入</button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td>
                        <button
                          onClick={() => setTempProduct(product)}
                          className="btn btn-primary"
                          type="button"
                        >
                          查看細節
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h2>單一產品細節</h2>
              {tempProduct.title ? (
                <div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top img-fluid"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge text-bg-primary">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <p className="card-text">
                      <del>{tempProduct.origin_price} 元</del> /{" "}
                      {tempProduct.price} 元
                    </p>
                    <h5 className="card-title">更多圖片：</h5>
                    {tempProduct.imagesUrl?.map(
                      (image) =>
                        image && (
                          <img alt="" key={image} src={image} className="img-fluid" />
                        )
                    )}
                  </div>
                </div>
              ) : (
                <p>請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          {/* onSubmit 用於處理表單的提交事件 */}
          <form onSubmit={handLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                name="username"
                onChange={handleInputChange}
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                name="password"
                onChange={handleInputChange}
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
