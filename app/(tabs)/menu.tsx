import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProductItem from "../../components/ProductionItem";
import { useCart } from "../../context/CartContext";

const DATA = [
  // Appetizers / Starters
  {
    id: "app1",
    name: "Lumpia Shanghai",
    price: 80,
    image: require("../../assets/images/appetizers/lumpia-shanghai.jpg"),
    category: "Appetizers / Starters",
  },
  {
    id: "app2",
    name: "Mozarella Sticks",
    price: 90,
    image: require("../../assets/images/appetizers/mozarella-sticks.jpg"),
    category: "Appetizers / Starters",
  },

  // Beverages
  {
    id: "bev1",
    name: "Coke",
    price: 35,
    image: require("../../assets/images/beverages/coke.jpg"),
    category: "Beverages",
  },
  {
    id: "bev2",
    name: "Cucumber Juice",
    price: 45,
    image: require("../../assets/images/beverages/cucumberjuice.jpg"),
    category: "Beverages",
  },
  {
    id: "bev3",
    name: "Iced Tea",
    price: 40,
    image: require("../../assets/images/beverages/IcedTea.jpg"),
    category: "Beverages",
  },

  // Desserts
  {
    id: "des1",
    name: "Red Velvet",
    price: 600,
    image: require("../../assets/images/desserts/cake.png"),
    category: "Desserts",
  },
  {
    id: "des2",
    name: "Tiramisu",
    price: 120,
    image: require("../../assets/images/desserts/tiramisu.jpg"),
    category: "Desserts",
  },

  // Main Courses
  {
    id: "main1",
    name: "Special Burger",
    price: 50,
    image: require("../../assets/images/main-courses/burger.png"),
    category: "Main Courses",
  },
  {
    id: "main2",
    name: "Fried Chicken",
    price: 99,
    image: require("../../assets/images/main-courses/fried.png"),
    category: "Main Courses",
  },
  {
    id: "main3",
    name: "Chicken",
    price: 120,
    image: require("../../assets/images/main-courses/chicken.png"),
    category: "Main Courses",
  },

  // Pasta & Noodles
  {
    id: "pasta1",
    name: "Carbonara",
    price: 110,
    image: require("../../assets/images/pasta&noodles/carbonara.jpg"),
    category: "Pasta & Noodles",
  },
  {
    id: "pasta2",
    name: "Lasagna",
    price: 110,
    image: require("../../assets/images/pasta&noodles/lasagna.jpg"),
    category: "Pasta & Noodles",
  },
  {
    id: "pasta3",
    name: "Pad Thai",
    price: 150,
    image: require("../../assets/images/pasta&noodles/padthai.jpg"),
    category: "Pasta & Noodles",
  },
  // Seafood Dishes
  {
    id: "sea1",
    name: "Grilled Salmon",
    price: 200,
    image: require("../../assets/images/seafood-dishes/grilled-salmon.jpg"),
    category: "Seafood Dishes",
  },
  {
    id: "sea2",
    name: "Calamari Rings",
    price: 180,
    image: require("../../assets/images/seafood-dishes/calamari.jpg"),
    category: "Seafood Dishes",
  },
  {
    id: "sea3",
    name: "Scallops",
    price: 180,
    image: require("../../assets/images/seafood-dishes/scallops.jpg"),
    category: "Seafood Dishes",
  },
  // Soup & Salad
  {
    id: "soup1",
    name: "Caesar Salad",
    price: 90,
    image: require("../../assets/images/soup&salad/caesarsalad.jpg"),
    category: "Soups & Salads",
  },
  {
    id: "soup2",
    name: "Beef & Vegetable Soup",
    price: 100,
    image: require("../../assets/images/soup&salad/beef&vegetable-soup.jpg"),
    category: "Soups & Salads",
  },
  {
    id: "soup3",
    name: "Chicken Noodle Soup",
    price: 70,
    image: require("../../assets/images/soup&salad/chicken-noodle-soup.jpg"),
    category: "Soups & Salads",
  },
];

export default function MenuScreen() {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cartVisible, setCartVisible] = useState(false);
  const [receipt, setReceipt] = useState<null | {
    code: string;
    items: typeof items;
    total: number;
    date: string;
  }>(null);
  const { items, add, remove, totalPrice, totalQty, clear } = useCart();

  const categories = ["All", "Appetizers / Starters", "Soups & Salads", "Main Courses", "Seafood Dishes", "Pasta & Noodles", "Vegetarian Dishes", "Desserts", "Beverages"];

  const filtered = DATA.filter(
    p =>
      p.name.toLowerCase().includes(q.toLowerCase()) &&
      (selectedCategory === "All" || p.category === selectedCategory)
  );

  const handleAdd = (item: typeof DATA[0]) => add(item);

  const generateReceiptCode = async (): Promise<string> => {
    try {
        const last = await AsyncStorage.getItem("lastReceiptNumber");
        let nextNumber = last ? parseInt(last) + 1 : 1;

        // Loop back to 0001 after 9999
        if (nextNumber > 9999) nextNumber = 1;

        await AsyncStorage.setItem("lastReceiptNumber", nextNumber.toString());
        
        // Pad with leading zeros (e.g., 0042)
        return nextNumber.toString().padStart(4, "0");
    } catch (e) {
        console.error("Error generating receipt code", e);
        return "0001"; // fallback
    }
    };


  const checkout = async () => {
    const code = await generateReceiptCode(); // ⬅ await here
    const now = new Date();

    setReceipt({
        code,
        items: [...items],
        total: totalPrice,
        date: now.toLocaleString(),
    });

    clear();
    setCartVisible(false);
    };


  return (
    <View style={s.container}>
      {/* Header with Cart Button */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Menu</Text>
        <TouchableOpacity style={s.cartBtn} onPress={() => setCartVisible(true)}>
          <Ionicons name="cart" size={28} color="#D20A62" />
          {totalQty > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeText}>{totalQty}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search food…"
        value={q}
        onChangeText={setQ}
        style={s.search}
      />

      {/* Category Dropdown */}
      <View style={{ marginBottom: 8, borderRadius: 10, overflow: "hidden", backgroundColor: "#F5F7FF", paddingHorizontal: 8, paddingVertical: 4, }}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={{ height: 52, marginTop: -8, }}
          dropdownIconColor="#D20A62"
        >
          {categories.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={it => it.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAdd(item)} activeOpacity={0.8}>
            <ProductItem {...item} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
      />

      {/* Cart Modal */}
      <Modal visible={cartVisible} animationType="slide" onRequestClose={() => setCartVisible(false)}>
        <View style={s.modalContainer}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Your Cart</Text>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Ionicons name="close" size={28} color="#D20A62" />
            </TouchableOpacity>
          </View>
          {items.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 50 }}>Your cart is empty.</Text>
          ) : (
            <>
              <FlatList
                data={items}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                  <View style={s.cartRow}>
                    <Text style={{ flex: 1 }}>{item.name} × {item.qty}</Text>
                    <Text style={{ width: 80, color: "gray" }}>₱{(item.price * item.qty).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => remove(item.id)}>
                      <Text style={{ color: "#D20A62" }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
                style={{ flexGrow: 0, marginBottom: 16 }}
              />
              <TouchableOpacity style={s.checkoutBtn} onPress={checkout}>
                <Text style={s.checkoutBtnText}>Checkout (₱{totalPrice.toFixed(2)})</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal visible={!!receipt} animationType="slide" transparent>
        <View style={s.receiptOverlay}>
          <View style={s.receiptContainer}>
            <Text style={s.receiptBrand}>Yummify</Text>
            <Text style={s.receiptTitle}>Official Receipt</Text>
            <Text style={s.receiptCode}>Receipt #: <Text style={{fontWeight:"bold"}}>{receipt?.code}</Text></Text>
            <Text>Date: {receipt?.date}</Text>
            <View style={s.receiptDivider} />
            <View>
              {receipt?.items.map(item => (
                <View key={item.id} style={s.receiptRow}>
                  <Text style={{flex:1}}>{item.name} x{item.qty}</Text>
                  <Text>₱{(item.price * item.qty).toFixed(2)}</Text>
                </View>
              ))}
            </View>
            <View style={s.receiptDivider} />
            <View style={s.receiptRow}>
              <Text style={{fontWeight:"bold"}}>Total</Text>
              <Text style={{fontWeight:"bold"}}>₱{receipt?.total.toFixed(2)}</Text>
            </View>
            <Text style={s.receiptThanks}>Thank you for ordering at Yummify!</Text>
            <TouchableOpacity style={s.receiptCloseBtn} onPress={() => setReceipt(null)}>
              <Text style={s.receiptCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 12, 
    marginTop: 24
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#D20A62" 
  },
  cartBtn: { 
    padding: 4 
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  cartBadgeText: { 
    color: "white", 
    fontSize: 10, 
    fontWeight: "bold" },
  search: { 
    backgroundColor: "#F5F7FF", 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 8 },
  modalContainer: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 20 
  },
  modalHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginBottom: 16 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#D20A62" 
  },
  cartRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12 
  },
  checkoutBtn: { 
    backgroundColor: "#D20A62", 
    padding: 16, 
    borderRadius: 10, 
    marginTop: 16 
  },
  checkoutBtnText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "bold" 
  },
  receiptOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  receiptContainer: {
    width: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },
  receiptBrand: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D20A62",
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  receiptCode: {
    fontSize: 14,
    marginBottom: 2,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#eee",
    alignSelf: "stretch",
    marginVertical: 10,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 260,
    marginBottom: 2,
  },
  receiptThanks: {
    marginTop: 16,
    fontSize: 15,
    color: "#D20A62",
    fontWeight: "600",
    textAlign: "center",
  },
  receiptCloseBtn: {
    marginTop: 18,
    backgroundColor: "#D20A62",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  receiptCloseBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
