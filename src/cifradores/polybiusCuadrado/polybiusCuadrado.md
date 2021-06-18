# {{cipher.NAME}}

## Acerca de
[{{cipher.NAME}}](http://en.wikipedia.org/wiki/Polybius_square) algoritmo trivial, donde cada letra del alfabeto es reemplazada por las coordenadas de su posición en un cuadrado.

## Caracteres validos
✅ Letras Mayusculas (`A-Z`)
✅ Letras Minusculas (`a-z`)
✅ Numeros (`0-9`)

**Numeros y Emojis**
Simbolos y emojis son **removidos** por este cifrador

**Los espacios son removidos**
Todos los espacios son removidos por este cifrador durante la codificacion

## Formula

### Codificando
```js
x = Math.floor(letterPosition / 6) + 1
y = (letterPosition mod 6) + 1
```

### Decodificando
```js
characterIndex = (x * 6) + y
```
