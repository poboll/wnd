import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { formatPrice } from "commons/helper";
import Panel from "components/Panel";
import EditInventory from "../components/EditInventory";
import axios from "../commons/axios";
import { toast } from "react-toastify";

class Product extends Component {
  toEdit = () => {
    // 使用Panel的方法
    Panel.open({
      component: EditInventory,
      props: {
        product: this.props.product,
        deleteProduct: this.props.delete,
      },
      callback: (data) => {
        if (data) {
          this.props.update(data);
        }
      },
    });
  };

  //加入購物車  使用 async await

  addCart = async () => {
    if (!global.auth.isLogin()) {
      this.props.history.push("/login");
      toast.info("Please Login First");
      return;
    }

    try {
      const user = global.auth.getUser() || {}
      const { id, name, image, price } = this.props.product;
      // 判斷是否有重複id商品
      const res = await axios.get(`/carts?productId=${id}`);
      const carts = res.data;
      // 如果有 則將商品數量+1
      if (carts && carts.length > 0) {
        const cart = carts[0];
        cart.mount += 1;
        await axios.put(`carts/${cart.id}`, cart);
        // 沒有 則將商品加入購物車
      } else {
        // 添加
        const cart = {
          productId: id,
          name,
          image,
          price,
          mount: 1,
          userID:user.email
        };
        await axios.post("/carts", cart);
      }
      toast("Add Cart Success");
      this.props.updateCartNum();
    } catch (error) {
      toast.error("Add Cart Failed");
    }
  };

  renderMangerBtn = () => {
    const user = global.auth.getUser() || {};
    if (user.type === 1) {
      return (
        <div className="p-head has-text-right" onClick={this.toEdit}>
          <div className="icon edit-btn">
            <i className="fas fa-sliders-h"></i>
          </div>
        </div>
      );
    }
  };

  render() {
    const { name, image, tags, price, status } = this.props.product;
    const _pClass = {
      available: "product",
      unavailable: "product out-stock",
    };
    return (
      <>

        <div className={_pClass[status]}>
          <div className="p-content">
            {this.renderMangerBtn()}
            <div className="img-wrapper">
              <div className="out-stock-text">Out of Stock</div>
              {/* scss ：out-stock-text 判斷顯示 */}
              <figure className="image is-4by3">
                <img src={image} alt={name} />
              </figure>
            </div>
            <p className="p-tags">{tags}</p>
            <p className="p-name">{name}</p>
          </div>
          <div className="p-footer">
            <p className="price">{formatPrice(price)}</p>
            <button
              className="add-cart"
              disabled={status === "unavailable"}
              onClick={this.addCart}
            >
              <i className="fas fa-shopping-cart"></i>
              <i className="fas fa-exclamation"></i>
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Product);
