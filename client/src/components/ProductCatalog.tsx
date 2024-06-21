import { useEffect, useState } from "react";
import Product from "./Product";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    // Здесь можно загрузить продукты из API или использовать заглушку
    const mockProducts = [
      {
        id: 1,
        name: "Продукт_1",
        description: "Описание ...",
        price: 100,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_1",
      },
      {
        id: 2,
        name: "Продукт_2",
        description: "Описание ...",
        price: 3100,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_2",
      },
      {
        id: 3,
        name: "Продукт_3",
        description: "Описание ...",
        price: 212,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_3",
      },
      {
        id: 4,
        name: "Продукт_4",
        description: "Описание ...",
        price: 4600,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_4",
      },
      {
        id: 5,
        name: "Продукт_5",
        description: "Описание ...",
        price: 80,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_5",
      },
      {
        id: 6,
        name: "Продукт_6",
        description: "Описание ...",
        price: 300,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_6",
      },
      {
        id: 7,
        name: "Продукт_7",
        description: "Описание ...",
        price: 9700,
        image:
          "https://images.unsplash.com/photo-1656543802898-41c8c46683a7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Категория_7",
      },
    ];
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || product.category === category)
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Input
          placeholder="Поиск продуктов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="Категория 1">Категория 1</SelectItem>
            <SelectItem value="Категория 2">Категория 2</SelectItem>
            {/* Добавьте больше категорий по вашему желанию */}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
