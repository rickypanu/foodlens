import { Home, Store, Truck, Package } from "lucide-react-native";

export const SOURCE_TYPES = [
  { id: "home", label: "Home-cooked", icon: Home, desc: "Made at home" },
  { id: "restaurant", label: "Restaurant", icon: Store, desc: "Dine-out/delivery" },
  { id: "street", label: "Street Food", icon: Truck, desc: "Vendor or stall" },
  { id: "packaged", label: "Packaged", icon: Package, desc: "Ready-to-eat" },
];
