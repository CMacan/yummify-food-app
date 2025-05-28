import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";

type Props = {
  id: string;
  name: string;
  price: number;
  image: number;       // require("…")
};

export default function ProductItem({ id, name, price, image }: Props) {
  const { add } = useCart();
  return (
    <TouchableOpacity style={s.card} onPress={() => add({ id, name, price, image })}>
      <Image source={image} style={s.img}/>
      <Text numberOfLines={1} style={s.name}>{name}</Text>
      <Text style={s.price}>₱ {price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 170,
    marginRight: 0,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    padding: 8,
    alignItems: "center",
    alignSelf: "center",
  },
  img: {
    width: 130,
    height: 90,
    borderRadius: 12,
    alignSelf: "center",
    resizeMode: "cover",
  },
  name: { marginTop: 8, fontWeight: "600", fontSize: 16, textAlign: "center" },
  price:{ color: "gray", fontSize: 14, textAlign: "center", marginTop: 2 },
});
