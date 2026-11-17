# Metrónomo

Un metrónomo digital adaptable a distintas pantallas, pensado para la práctica musical y los ensayos de banda. Reúne velocidad ajustable, selección de compás, tempo mediante pulsaciones, clics sintetizados e indicadores visuales en una sola página.

**Idioma:** [English](README.md) · Español

## Funciones

- **Velocidad ajustable:** Introduce un valor o usa los botones `−` y `+` para cambiar 1 BPM por pulsación. El rango es de **30 a 300 BPM**.
- **Compases:** Elige entre **2/4, 3/4, 4/4 y 6/8**. La cantidad de indicadores visuales corresponde al número de tiempos del compás seleccionado.
- **Controles de reproducción:** Inicia, pausa, reanuda y detén. Pausar conserva el avance del compás; detener apaga el indicador y vuelve al primer tiempo.
- **Tempo con TAP:** Pulsa `TAP` al menos dos veces. La velocidad se calcula con el promedio de los intervalos recientes, usando hasta cinco pulsaciones. Una pausa de más de 2,2 segundos inicia una nueva secuencia.
- **Acentos sonoros y visuales:** El primer tiempo tiene un clic más fuerte y agudo, y se ilumina en rojo óxido. Los demás usan dorado. En 6/8, el cuarto tiempo tiene un tono distinto para marcar el segundo grupo de tres.
- **Diseño adaptable y accesible:** La interfaz se ajusta a pantallas estrechas, muestra el foco del teclado y respeta la preferencia de movimiento reducido.

## Inicio rápido

No se necesita instalación ni compilación. Abre `index.html` en un navegador moderno y selecciona **Start** para activar el audio e iniciar la reproducción. Las fuentes se cargan desde Google Fonts, por lo que se necesita internet para ver la tipografía prevista; sin conexión se utilizan fuentes alternativas del sistema.

## Controles

| Control | Acción |
| --- | --- |
| Campo BPM | Introduce una velocidad entre 30 y 300 BPM. |
| `−` / `+` | Reduce o aumenta la velocidad en 1 BPM. |
| Selector de compás | Cambia entre 2/4, 3/4, 4/4 y 6/8. |
| Start / Pause / Resume | Controla la reproducción y conserva la posición al pausar. |
| Stop | Detiene la reproducción y vuelve al primer tiempo. |
| TAP | Ajusta la velocidad a partir del ritmo de varias pulsaciones. |
| Espacio | Inicia o pausa cuando el foco está fuera de un campo, selector o botón. |

## Herramientas y tecnologías

| Tecnología | Función |
| --- | --- |
| HTML5 | Estructura, controles y etiquetas de accesibilidad. |
| CSS3 | Diseño adaptable, tipografía, colores, degradados y animación de los tiempos. |
| JavaScript puro | Cálculo de velocidad, estado, eventos y actualización visual. |
| Web Audio API | Programación basada en el reloj de audio y síntesis de clics. |
| Google Fonts | Montserrat, Barlow Condensed, DM Mono e Inter. |

## Implementación

El proyecto utiliza **HTML5, CSS3 y JavaScript puro**. No necesita un framework, gestor de paquetes ni dependencias de JavaScript de terceros.

- **`index.html`** contiene los controles semánticos y sus etiquetas de accesibilidad.
- **`styles.css`** define la distribución adaptable, los colores, degradados, indicadores con forma de metrónomo, estados de foco y comportamiento con movimiento reducido. La tipografía utiliza **Montserrat, Barlow Condensed, DM Mono e Inter** desde Google Fonts.
- **`script.js`** gestiona la velocidad, el compás, el cálculo de TAP, la reproducción y las actualizaciones visuales.

El audio se genera en el navegador mediante la **Web Audio API**. Un programador se ejecuta cada 25 ms y prepara los clics aproximadamente 100 ms antes usando el reloj de audio. Cada clic es un oscilador de onda senoidal breve con una envolvente de volumen. Los indicadores visuales se sincronizan con los eventos de audio programados. Si se cambia la velocidad o el compás durante la reproducción, se cancelan los clics pendientes y se reprograman con el nuevo valor.

En **6/8**, cada uno de los seis tiempos visibles recibe un clic a la velocidad seleccionada; el cuarto marca el segundo grupo de tres. Por tanto, los BPM se refieren a los tiempos de corchea mostrados, no a negras con puntillo.

## Archivos del proyecto

```text
metronomo/
├── index.html       # Estructura y controles
├── styles.css       # Diseño visual y adaptación a pantallas
├── script.js        # Lógica y programación del audio
├── README.md        # Documentación en inglés
└── README.es.md     # Documentación en español
```

## Compatibilidad y verificación

Utiliza un navegador actualizado que admita `AudioContext` y funciones CSS estándar como `clip-path`. El audio comienza tras una acción de la persona usuaria, según las políticas de reproducción automática de los navegadores.

Puedes comprobar la sintaxis de JavaScript con:

```sh
node --check script.js
```

Este prototipo local no incluye una batería de pruebas automatizadas ni configuración de despliegue.
