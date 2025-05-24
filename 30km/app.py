from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/amsterdam')
def amsterdam():
    return render_template('amsterdam.html')

@app.route('/tool')
def tool():
    return render_template('tool.html')

@app.route('/result')
def result():
    return render_template('result1.html')

if __name__ == '__main__':
    app.run(debug=True)
