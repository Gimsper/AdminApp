import { createContext, useContext, useState, ReactNode } from 'react';

export type Item = {
    itemId: number,
    name: string,
    categoryName: string,
    price: number,
    quantity: number,
}

type ShoppingCartContextType = {
    shoppingCartItems: Item[],
    setShoppingCartItems: (e: Item[]) => void,
    addToShoppingCart: (e: string) => void,
    clearShoppingCart: () => void,
    removeFromShoppingCart: (e: number) => void,
    isScanning: boolean,
    setIsScanning: (e: boolean) => void,
    qrData: string | null,
    setQrData: (e: string | null) => void
};

type ShoppingCartProviderProps = {
  children: ReactNode;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | null>(null);

export const ShoppingCartProvider = ({ children }: ShoppingCartProviderProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [shoppingCartItems, setShoppingCartItems] = useState<Item[]>([]);
    const [qrData, setQrData] = useState<string | null>(null);
    
    const removeFromShoppingCart = (id: number) => {
        setShoppingCartItems(prev => prev.filter(e => e.itemId !== id));
        if (shoppingCartItems.length === 1)
            setIsScanning(false);
    };

    const addToShoppingCart = (e: string) => {
        try {
            const item = JSON.parse(e) as Item;
            if (!item.itemId || !item.name) throw new Error("QR inválido");

            setShoppingCartItems(prevItems => {
                const existItem = prevItems.find(i => i.itemId === item.itemId);
                return existItem 
                    ? prevItems.map(i => i.itemId === item.itemId
                        ? {...i, quantity: i.quantity + 1} : i)
                        : [...prevItems, {...item, quantity: 1}];
            });
        } catch (error) {
            console.error("Error procesando QR:", error);
        }
    };

  const clearShoppingCart = () => {
    setQrData(null);
    setIsScanning(false);
    setShoppingCartItems([]);
  }
    const value = {
        shoppingCartItems,
        setShoppingCartItems,
        addToShoppingCart,
        clearShoppingCart,
        removeFromShoppingCart,
        isScanning,
        setIsScanning,
        qrData,
        setQrData,
    };

    return (
        <ShoppingCartContext.Provider
            value={value}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) throw new Error("useShoppingCar debe usarse dentro de un ShoppingCarProvider");
  return context;
};