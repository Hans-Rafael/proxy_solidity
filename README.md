# proxy_solidity
# Entendiendo cómo trabaja un Proxy en Solidity

Este proyecto muestra un ejemplo básico del funcionamiento de un contrato **proxy** en Solidity. El objetivo es aprender cómo un proxy delega llamadas a otro contrato (llamado contrato lógico o implementación), permitiendo flexibilidad para actualizar la lógica sin cambiar los datos ni la dirección del contrato.

---

## Índice
1. [Requisitos](#requisitos)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Contratos](#contratos)
   - LogicV1
   - LogicV2
   - Proxy
5. [Flujo del Proxy](#flujo-del-proxy)
6. [Ejecución](#ejecución)
   - Despliegue
   - Pruebas
7. [Resultados Esperados](#resultados-esperados)

---

## Requisitos
- Node.js v16+  
- npm o yarn
- Hardhat (instalado en este proyecto)

---

## Estructura del Proyecto

```plaintext
/proxy-example
├── contracts/
│   ├── LogicV1.sol      # Primera versión de la lógica
│   ├── LogicV2.sol      # Segunda versión de la lógica con cambios
│   └── Proxy.sol        # Contrato Proxy
├── scripts/
│   └── deploy.ts        # Script de despliegue de contratos
├── test/
│   └── proxy.test.ts    # Pruebas del flujo del Proxy
├── hardhat.config.ts    # Configuración de Hardhat
├── package.json         # Dependencias del proyecto
└── tsconfig.json        # Configuración de TypeScript
```

---

## Instalación y Configuración

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd proxy-example
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Compila los contratos:
   ```bash
   npx hardhat compile
   ```

---

## Contratos

### 1. LogicV1
La primera versión de nuestro contrato lógico, con una función para guardar un número:
```solidity
pragma solidity ^0.8.0;

contract LogicV1 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number;
    }
}
```

### 2. LogicV2
Una versión actualizada con cambios en la lógica y una nueva función:
```solidity
pragma solidity ^0.8.0;

contract LogicV2 {
    uint public number;

    function setNumber(uint _number) public {
        number = _number * 2; // Cambiamos la lógica
    }

    function getDouble() public view returns (uint) {
        return number * 2;
    }
}
```

### 3. Proxy
El contrato proxy delega llamadas al contrato lógico mediante `delegatecall` y permite actualizar la implementación:
```solidity
pragma solidity ^0.8.0;

contract Proxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function upgrade(address newImplementation) public {
        implementation = newImplementation;
    }

    fallback() external payable {
        (bool success, bytes memory data) = implementation.delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }
}
```

---

## Flujo del Proxy

1. **Despliegue Inicial:**
   - Se despliega `LogicV1`.
   - El proxy se inicializa apuntando a `LogicV1`.

2. **Interacción con LogicV1:**
   - Llamadas como `setNumber(42)` se delegan a `LogicV1`.
   - Los datos (`number`) se almacenan en el proxy, no en `LogicV1`.

3. **Actualización de Lógica:**
   - Se despliega `LogicV2`.
   - El proxy actualiza su referencia a `LogicV2` mediante `upgrade`.

4. **Interacción con LogicV2:**
   - Ahora las llamadas delegan a `LogicV2`, utilizando la nueva lógica.
   - Los datos existentes en el proxy permanecen intactos.

---

## Ejecución

### Despliegue

Ejecuta el script de despliegue:
```bash
npx hardhat run scripts/deploy.ts
```

### Pruebas

Ejecuta las pruebas para verificar el flujo completo:
```bash
npx hardhat test
```

---

## Resultados Esperados

1. **Interacción inicial con LogicV1:**
   - Llamar a `setNumber(42)` almacena `42`.

2. **Actualización a LogicV2:**
   - Llamar a `setNumber(42)` almacena `84` (42 * 2).
   - Puedes usar la nueva función `getDouble()` para obtener `168` (84 * 2).

---

## Conclusión
Este proyecto demuestra cómo un proxy permite:
- **Actualizar la lógica de un contrato** sin cambiar su estado ni dirección.
- **Reutilizar datos almacenados en el proxy.**
- **Simplificar interacciones complejas** al abstraer la lógica del contrato.

¡Experimenta cambiando la lógica y observa el comportamiento del proxy! 🚀


