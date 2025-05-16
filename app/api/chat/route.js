export async function POST(request) {

  try {
    const { message } = await request.json();

const body = {
      model: "sonar",
      messages: [
        {
          role: "system",
           "content": process.env.SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
      top_p: 0.9,
      return_images: true,
      return_related_questions: false,
      stream: false,
      web_search_options: {
        search_depth: "deep"
      }
    };



    // Aqui você chama sua API externa, por exemplo com fetch:
    const response = await fetch(process.env.API_PERPLXITY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_PERPLXITY_KEY}`, // se precisar
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Erro na API externa" }), { status: 500 });
    }

    const data = await response.json();

    
    // Ajuste conforme o formato da resposta da sua API externa
    const reply = {citations: data.citations, 
        images: data.images,
        text: data.choices?.[0]?.message} || "Sem resposta";
    
 
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), { status: 500 });
  }
}
