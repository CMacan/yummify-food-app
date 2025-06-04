import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

type Props = {
  id: string;
  name: string;
  price: number;
  image: number;
};

export default function ProductItem({ id, name, price, image }: Props) {
  const { add } = useCart();

  return (
    <View style={s.card}>
      <Image source={image} style={s.img} />
      <Text numberOfLines={1} style={s.name}>{name}</Text>
      <Text style={s.price}>₱ {price.toFixed(2)}</Text>

      <TouchableOpacity
        style={s.plusBtn}
        onPress={() => add({ id, name, price, image })}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle" size={28} color="#D20A62" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 170,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    padding: 8,
    alignItems: "center",
    alignSelf: "center",
    position: "relative", // Needed for absolute children
  },
  img: {
    width: 130,
    height: 90,
    borderRadius: 12,
    alignSelf: "center",
    resizeMode: "cover",
  },
  name: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  price: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  plusBtn: {
    position: "absolute",
    bottom: 3,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
  },
});
