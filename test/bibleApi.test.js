// -> Teste arquivo por arquivo, pois o servidor não aceita muitas requisições


/*
Oráculos que usamos:
 https://www.ebooksbrasil.org/eLibris/biblia.html para a versão em português João Ferreira de Almeida.
https://www.aionianbible.org/ para a versão Checa.

https://vulsearch.sourceforge.net/html/Jo.html para a Clementine Latin Vulgate.

E para as demais:
https://www.biblegateway.com/ (versão “WEB” padrão,  KJV, Novo Testamento Cherokee).
*/

const axios = require('axios');

const BASE_URL = 'https://bible-api.com';

describe('Bible API Tests', () => {
    // Versículos Únicos
    test('Dever buscar um único verso do Êxodo', async () => {
      const response = await axios.get(`${BASE_URL}/exodus 20:13`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('reference', 'Exodus 20:13');
      expect(response.data.text).toMatch(/You shall not murder/);
    });

        test('Deve buscar um único versículo do Gênesis', async () => {
        const response = await axios.get(`${BASE_URL}/genesis 1:1`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('reference', 'Genesis 1:1');
        expect(response.data.text).toMatch(/In the beginning, God created the heavens and the earth/);
    });

    test('Deve buscar um único verso de João', async () => {
        const response = await axios.get(`${BASE_URL}/john 3:14`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('reference', 'John 3:14');
        expect(response.data.text).toMatch(/As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,/);
    });

    test('Deve buscar um único verso de João: John 3:16', async () => {
        const response = await axios.get(`${BASE_URL}/john+3:16`);
        expect(response.data.reference).toBe('John 3:16');
        expect(response.data.text).toContain('For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.');
    });

    // Intervalo de Versos
    test('Intervalo de Versos: Luke 12:1-2', async () => {
        const response = await axios.get(`${BASE_URL}/luke+12:1-2`);
        expect(response.data.reference).toBe('Luke 12:1-2');
        expect(response.data.text).toContain('Meanwhile, when a multitude of many thousands had gathered together, so much so that they trampled on each other, he began to tell his disciples first of all,\n“Beware of the yeast of the Pharisees, which is hypocrisy.');
    });
    

    // Múltiplos Intervalos
    test('Múltiplos Intervalos: Romans 12:1-2,5-7,9,13:1-9', async () => {
        const response = await axios.get(`${BASE_URL}/romans+12:1-2,5-7,9,13:1-9`);
        expect(response.data.reference).toBe('Romans 12:1-2,5-7,9,13:1-9');
        expect(response.data.text).toContain('Therefore I urge you, brothers, by the mercies of God, to present your bodies a living sacrifice, holy, acceptable to God, which is your spiritual service.');
    });

    
    test('Deve buscar vários intervalos de Isaías', async () => {
        const response = await axios.get(`${BASE_URL}/Isaiah40:1-2,5-7`);
        expect(response.status).toBe(200);
        expect(response.data.verses.length).toBe(5); //5 versículos
     });

    test('Deve buscar vários intervalos do livro de Hebreus', async () => {
        const response = await axios.get(`${BASE_URL}/Hebrews12:1-2,5-7,9,13:1-9&10`);
        expect(response.status).toBe(200);
        expect(response.data.verses.length).toBeGreaterThan(0);

    });
  
      test('Deve buscar vários intervalos de Salmos', async () => {
          const response = await axios.get(`${BASE_URL}/Psalms23:1-2,4-6`);
          expect(response.status).toBe(200);
          expect(response.data.verses.length).toBe(5); //5 versículos
      });

    // Nomes Abreviados de Livros
    test('Deve buscar o versículo usando o nome abreviado do livro (para João)', async () => {
        const response = await axios.get(`${BASE_URL}/jn 3:15`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('reference', 'John 3:15');
        expect(response.data.text).toMatch('that whoever believes in him should not perish, but have eternal life.');
    });


    test('Deve buscar o versículo usando o nome abreviado do livro (para Gênesis)', async () => {
        const response = await axios.get(`${BASE_URL}/gen 1:1`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('reference', 'Genesis 1:1');
        expect(response.data.text).toMatch(/In the beginning/);
    });
  
    // Números de Versículos
    test('Deve buscar versículo com números de versículos incluídos', async () => {
        const response = await axios.get(`${BASE_URL}/john 3:17?verse_numbers=true`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('reference', 'John 3:17');
        expect(response.data.text).toContain('17')
    });

    // JSONP
    test('Deve buscar verso com retorno de chamada JSONP', async () => {
        const response = await axios.get(`${BASE_URL}/john 3:18?callback=func`, {
        responseType: 'text'
        });
        expect(response.status).toBe(200);
        expect(response.data).toMatch(/^func\(/); //Este teste assegura que a API da Bíblia é capaz de lidar corretamente com solicitações de versículos usando JSONP, garantindo que o retorno de chamada especificado (func) seja incluído na resposta conforme esperado.
    });

        //Outros
        test('Verso com Tradução Diferente em ingles: John 3:16 KJV', async () => {
            const response = await axios.get(`${BASE_URL}/john+3:16?translation=kjv`);
            expect(response.data.reference).toBe('John 3:16');
            expect(response.data.translation_id).toBe('kjv');
            expect(response.data.text).toContain('For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.');
        });
    
        test('Verso Aleatório', async () => {
            const response = await axios.get(`${BASE_URL}/?random=verse`);
            expect(response.data).toHaveProperty('text');
            expect(response.data).toHaveProperty('reference');
            expect(response.data).toHaveProperty('verses');
        });
    

    // test('Verso Inexistente', async () => {
    //     const response = await axios.get(`${BASE_URL}/john+999:999`);
    //     expect(response.data.error).toBe('not found');
    // });

    // test('Livro Inexistente', async () => {
    //     const response = await axios.get(`${BASE_URL}/nonexistentbook+1:1`);
    //     expect(response.data.error).toBe('not found');
    // });

    // test('Capítulo e Verso Inexistente', async () => {
    //     const response = await axios.get(`${BASE_URL}/genesis+999:999`);
    //     expect(response.data.error).toBe('not found');
    // });

    // test('Verso com Tradução Diferente Específica: John 3:16 NIV', async () => {
    //     const response = await axios.get(`${BASE_URL}/john+3:16?translation=niv`);
    //     expect(response.data.reference).toBe('John 3:16');
    //     expect(response.data.translation_id).toBe('niv');
    //     expect(response.data.text).toContain('For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.');
    // });

    // test('Verso com Múltiplas Traduções', async () => {
    //     const response = await axios.get(`${BASE_URL}/john+3:16?translation=kjv,niv`);
    //     expect(response.data.reference).toBe('John 3:16');
    //     expect(response.data.text).toContain('For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.');
    //     expect(response.data.text).toContain('For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.');
    // });

 
});
