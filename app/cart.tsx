import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { items, remove, clear, totalPrice } = useCart();

  const checkout = () => {
    Alert.alert("Checkout", `You’ve paid ₱${totalPrice.toFixed(2)}. Thank you!`);
    clear();
  };

  return (
    <View style={s.container}>
      {items.length === 0 ? (
        <Text style={{ textAlign:"center", marginTop:50 }}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={s.row}>
                <Image source={item.image} style={s.img} />
                <View style={{ flex:1 }}>
                  <Text>{item.name} × {item.qty}</Text>
                  <Text style={{ color:"gray" }}>₱{(item.price * item.qty).toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => remove(item.id)}>
                  <Text style={{ color:"#D20A62" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity style={s.btn} onPress={checkout}>
            <Text style={s.btnText}>Checkout (₱{totalPrice.toFixed(2)})</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:"#fff" },
  row:{ flexDirection:"row", alignItems:"center", marginBottom:12 },
  img:{ width:60, height:50, borderRadius:6, marginRight:10 },
  btn:{ backgroundColor:"#D20A62", padding:16, borderRadius:10 },
  btnText:{ color:"#fff", textAlign:"center", fontWeight:"bold" },
});
